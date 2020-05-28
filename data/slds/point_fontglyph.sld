<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>Font Glyph</Name>
    <UserStyle>
      <Title>Font Glyph</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Small populated New Yorks</Name>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>ttf://My Font Name#0x0A23</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#FF0000</CssParameter>
                  <CssParameter name="fill-opacity">0.5</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#0000FF</CssParameter>
                  <CssParameter name="stroke-opacity">0.7</CssParameter>
                </Stroke>
              </Mark>
              <Size>10</Size>
              <Opacity>1</Opacity>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
